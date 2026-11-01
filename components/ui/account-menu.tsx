import { Suspense } from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400";

const avatarClasses = `flex size-13 items-center justify-center rounded-full border-2 border-white bg-neutral-200 text-neutral-500 shadow-sm ${focusRing}`;

/** Placeholder avatar: the signed-out sign-in trigger and the loading fallback. */
function AvatarPlaceholder() {
  return (
    <button type="button" aria-label="Sign in" className={avatarClasses}>
      <User aria-hidden className="size-6" />
    </button>
  );
}

/** Nav account control: Clerk's user button when signed in, sign-in otherwise. */
export function AccountMenu() {
  return (
    <Suspense fallback={<AvatarPlaceholder />}>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <AvatarPlaceholder />
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-13 border-2 border-white shadow-sm",
            },
          }}
        />
      </Show>
    </Suspense>
  );
}
