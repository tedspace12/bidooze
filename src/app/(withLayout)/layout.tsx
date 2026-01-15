import Footer from "@/components/shared/footer";
import PrimaryHeader from "@/components/shared/PrimaryHeader";
import SecondaryHeader from "@/components/shared/SecondaryHeader";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background">
            <PrimaryHeader isLoggedIn={false} />
            <SecondaryHeader />
            {children}
            <Footer />
        </div>
    );
}