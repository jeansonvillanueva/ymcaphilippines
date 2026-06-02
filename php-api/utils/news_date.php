<?php
/**
 * Parse news display dates for sorting (mirrors frontend/src/utils/newsDate.ts).
 * Avoids strtotime/Date.parse pitfalls on ranges like "May 22-24, 2026".
 */

const NEWS_DATE_MONTHS = [
    'january' => 0,
    'february' => 1,
    'march' => 2,
    'april' => 3,
    'may' => 4,
    'june' => 5,
    'july' => 6,
    'august' => 7,
    'september' => 8,
    'october' => 9,
    'november' => 10,
    'december' => 11,
];

const NEWS_DATE_INVALID = PHP_INT_MIN;

function normalizeNewsDateInput(string $date): string
{
    $date = preg_replace('/[\x{2013}\x{2014}]/u', '-', $date);
    $date = str_replace("\xC2\xA0", ' ', $date);
    $date = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}]/u', '', $date);
    $date = preg_replace('/\s+/u', ' ', $date);
    return trim($date);
}

function newsDatePartsFromMonthRangeMatch(array $match): ?array
{
    $startMonthName = strtolower($match[1]);
    $startDay = (int) $match[2];
    $endMonthName = strtolower($match[3] !== '' ? $match[3] : $match[1]);
    $endDay = (int) ($match[4] !== '' ? $match[4] : $match[2]);
    $year = (int) $match[5];

    if (!isset(NEWS_DATE_MONTHS[$startMonthName], NEWS_DATE_MONTHS[$endMonthName])) {
        return null;
    }

    $startMonth = NEWS_DATE_MONTHS[$startMonthName];
    $endMonth = NEWS_DATE_MONTHS[$endMonthName];

    return [
        'start' => mktime(0, 0, 0, $startMonth + 1, $startDay, $year) ?: NEWS_DATE_INVALID,
        'end' => mktime(0, 0, 0, $endMonth + 1, $endDay, $year) ?: NEWS_DATE_INVALID,
    ];
}

function parseNewsMonthRange(string $normalized): ?array
{
    $monthPattern = 'January|February|March|April|May|June|July|August|September|October|November|December';

    $patterns = [
        '/\b(' . $monthPattern . ')\s+(\d{1,2})(?:\s*-\s*(?:(' . $monthPattern . ')\s+)?(\d{1,2}))?,?\s*((?:19|20)\d{2})\b/i',
        '/\b(' . $monthPattern . ')\s+(\d{1,2})\s*[-–—]\s*(?:((' . $monthPattern . ')\s+)?(\d{1,2}))?,?\s*((?:19|20)\d{2})\b/i',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $normalized, $match)) {
            return newsDatePartsFromMonthRangeMatch($match);
        }
    }

    return null;
}

function hasAmbiguousNewsDayRange(string $normalized): bool
{
    $monthPattern = 'January|February|March|April|May|June|July|August|September|October|November|December';
    return (bool) preg_match(
        '/\b(' . $monthPattern . ')\s+(\d{1,2})\s*[-–—]\s*(?:((' . $monthPattern . ')\s+)?(\d{1,2}))?,?\s*((?:19|20)\d{2})\b/i',
        $normalized
    );
}

function parseNewsDateParts(?string $date): array
{
    if ($date === null || trim($date) === '') {
        return ['start' => NEWS_DATE_INVALID, 'end' => NEWS_DATE_INVALID];
    }

    $normalized = normalizeNewsDateInput($date);
    $fromRange = parseNewsMonthRange($normalized);
    if ($fromRange !== null) {
        return $fromRange;
    }

    if (!hasAmbiguousNewsDayRange($normalized)) {
        $parsed = strtotime($normalized);
        if ($parsed !== false) {
            return ['start' => $parsed, 'end' => $parsed];
        }
    }

    if (preg_match('/\b(19|20)\d{2}\b/', $normalized, $yearMatch)) {
        $fallback = strtotime($yearMatch[0] . '-01-01');
        if ($fallback !== false) {
            return ['start' => $fallback, 'end' => $fallback];
        }
    }

    return ['start' => NEWS_DATE_INVALID, 'end' => NEWS_DATE_INVALID];
}

function compareNewsDatesDesc(?string $dateA, ?string $dateB): int
{
    $a = parseNewsDateParts($dateA);
    $b = parseNewsDateParts($dateB);

    if ($b['start'] !== $a['start']) {
        return $b['start'] <=> $a['start'];
    }

    return $a['end'] <=> $b['end'];
}

/** Read display date from a news row (handles column name variants). */
function getNewsRowDate(array $row): ?string
{
    foreach (['date', 'Date', 'event_date', 'eventDate'] as $key) {
        if (!empty($row[$key]) && is_string($row[$key])) {
            return trim($row[$key]);
        }
    }
    return null;
}

function sortNewsRowsByDateDesc(array $rows): array
{
    usort($rows, function (array $a, array $b): int {
        return compareNewsDatesDesc(getNewsRowDate($a), getNewsRowDate($b));
    });
    return $rows;
}
