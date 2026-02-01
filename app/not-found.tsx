import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="flex items-center text-xl font-semibold">
        <span>Page Not Found</span>
        <div className="mx-3 w-0.5 h-5 bg-white" />
        <Link href="/" className="text-elysia">
          Home
        </Link>
      </h1>
    </div>
  );
}
