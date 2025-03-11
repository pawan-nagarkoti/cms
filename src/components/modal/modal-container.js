import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ModalContainer({ isOpen, setIsOpen, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>{children}</div>
        <DialogFooter>
          {/* <Button type="submit" onClick={() => setIsOpen(false)}>
            Save changes
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
