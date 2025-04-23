import Link from "next/link";
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="py-6 px-4 mt-12 bg-gray-50 border-t">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
          <span>Email: <a href="mailto:Jsouza@fathomrealty.com" className="underline hover:text-red-500">Jsouza@FathomRealty.com</a></span>
          <span>Instagram: <a href="https://instagram.com/joeysouza96" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500">@joeysouza96</a></span>
          <span>Phone: <a href="tel:9197171428" className="underline hover:text-red-500">919-717-1428</a></span>
        </div>
        <div className="flex items-center">
          <Link href="/" className="mr-2">
            <span className="text-base font-medium cursor-pointer hover:text-red-500 transition">
              Joey <span className="text-red-500">Souza</span>
            </span>
          </Link>
          <Image
            src="/FathomLogo-Transparent-Web.png"
            alt="Fathom Realty Logo"
            width={100}  // Adjust as needed
            height={30} // Adjust as needed
          />
        </div>
      </div>
    </footer>
  );
}

