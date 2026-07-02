// client/src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-5 px-4 text-sm text-muted-foreground">
      <p>
        &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
      </p>
    </footer>
  );
}
