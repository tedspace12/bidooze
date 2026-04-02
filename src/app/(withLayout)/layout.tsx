'use client';

import Footer from "@/components/shared/footer";
import PrimaryHeader from "@/components/shared/PrimaryHeader";
import SecondaryHeader from "@/components/shared/SecondaryHeader";
import { useUser } from "@/features/auth/context/UserContext";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isLoggedIn } = useUser();

    return (
        <div className="min-h-screen bg-background">
            <PrimaryHeader isLoggedIn={isLoggedIn} />
            <SecondaryHeader />
            {children}
            <Footer />
        </div>
    );
}