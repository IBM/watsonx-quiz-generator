"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "./ui/Spinner";
interface LoadingProps {
  open: boolean;
}
function Loading({ open }: LoadingProps) {
  const loadingText =
    "Generating Quiz. This may take a few minutes. Please be patient.";

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle style={{ display: "none" }}>Processing</DialogTitle>
        <DialogContent className="[&>button]:hidden">
          <DialogDescription style={{ display: "none" }}>
            Processing Transaction
          </DialogDescription>
          <div className="text-lg items-center justify-center  flex-wrap gap-2 font-semibold ml-4 transition-all flex">
            <Spinner />
            {loadingText}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Loading;
