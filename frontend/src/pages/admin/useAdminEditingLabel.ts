import { useEffect } from 'react';

export type AdminEditingItemChange = (label: string | null) => void;

export function useAdminEditingLabel(
  onEditingItemChange: AdminEditingItemChange | undefined,
  isEditing: boolean,
  label: string,
) {
  useEffect(() => {
    if (!onEditingItemChange) return;

    if (isEditing && label.trim()) {
      onEditingItemChange(label.trim());
    } else {
      onEditingItemChange(null);
    }

    return () => onEditingItemChange(null);
  }, [onEditingItemChange, isEditing, label]);
}
