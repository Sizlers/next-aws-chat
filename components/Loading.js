import { VscLoading } from "react-icons/vsc";

export default function Loading() {
  return (
    <div className="h-screen w-screen absolute top-0 left-0 flex items-center justify-center z-10 bg-white bg-opacity-70">
      <VscLoading className="animate-spin text-9xl block" />
    </div>
  )
}