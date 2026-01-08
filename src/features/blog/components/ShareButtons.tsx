import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, Mail } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="icon"
          className="h-9 w-9"
          asChild
        >
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={copyToClipboard}
        aria-label="Copy link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShareButtons;
