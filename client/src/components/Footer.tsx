// client/src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="fixed left-0 bottom-0 w-full flex items-center justify-center py-5 px-4">
      <p>
        &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
      </p>
    </footer>
  );
}
