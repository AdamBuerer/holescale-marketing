import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Trash2, Mail, Download, Edit, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  actions: {
    label: string;
    icon: React.ReactNode;
    onClick: (ids: string[]) => Promise<void> | void;
    variant?: 'default' | 'destructive';
    requiresConfirmation?: boolean;
    confirmTitle?: string;
    confirmDescription?: string;
  }[];
}

export function BulkActionsBar({
  selectedIds,
  onClearSelection,
  actions,
}: BulkActionsBarProps) {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action?: () => Promise<void> | void;
    title?: string;
    description?: string;
  }>({ open: false });

  if (selectedIds.length === 0) return null;

  const handleAction = async (action: typeof actions[0]) => {
    if (action.requiresConfirmation) {
      setConfirmDialog({
        open: true,
        action: () => action.onClick(selectedIds),
        title: action.confirmTitle || 'Confirm Action',
        description: action.confirmDescription || `Are you sure you want to perform this action on ${selectedIds.length} items?`,
      });
    } else {
      setActionInProgress(true);
      try {
        await action.onClick(selectedIds);
        onClearSelection();
      } finally {
        setActionInProgress(false);
      }
    }
  };

  const executeConfirmedAction = async () => {
    if (confirmDialog.action) {
      setActionInProgress(true);
      try {
        await confirmDialog.action();
        onClearSelection();
      } finally {
        setActionInProgress(false);
        setConfirmDialog({ open: false });
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4 min-w-[400px]">
          <Badge variant="secondary" className="px-3 py-1">
            {selectedIds.length} selected
          </Badge>

          <div className="flex-1 flex gap-2">
            {actions.map((action, idx) => (
              action.variant === 'destructive' ? (
                <Button
                  key={idx}
                  variant="destructive"
                  size="sm"
                  onClick={() => handleAction(action)}
                  disabled={actionInProgress}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              ) : (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={actionInProgress}
                    >
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAction(action)}>
                      Execute
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={actionInProgress}
          >
            Clear
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeConfirmedAction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Example usage component
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isSelected = (id: string) => selectedIds.includes(id);
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < items.length;

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isSomeSelected,
  };
}
