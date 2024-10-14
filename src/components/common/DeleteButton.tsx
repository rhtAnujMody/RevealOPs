import React from 'react';
import { Button } from "@/components/ui/button";
import { TrashIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
  itemName: string;
}

export function DeleteButton({ onDelete, itemName }: DeleteButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete();
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleDeleteClick}
        variant="outline"
        size="sm"
        className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <TrashIcon className="w-4 h-4 mr-1" />
        Delete
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="pr-8"> {/* Add right padding for close button */}
            <DialogTitle className="text-lg">Delete {itemName}</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this {itemName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
