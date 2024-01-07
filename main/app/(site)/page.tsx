import JoinUsButton from "@/components/auth/JoinUsButton";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative w-full h-screen opacity-90">
            {/* Background Image */}
            <Image
                src="/images/brano-Mm1VIPqd0OA-unsplash.jpg"
                alt="ScienceHub background"
                fill={true}
                objectFit="cover"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
            {/* Text Overlay */}
            <div className="absolute top-48 left-0 right-0 text-center px-2 text-white shadow-outline opacity-100">
                <span className="font-bold block" style={{ fontSize: "3rem", lineHeight: "3rem" }}>
                    Welcome to ScienceHub
                </span>
                <span className="text-2xl font-semibold block mt-6">
                    A Comprehensive Platform for facilitating the Scientific Process
                </span>
                <div className="flex items-center justify-center space-x-8 mt-16">
                    <JoinUsButton />
                    <Link href="/browse" className="px-6 py-3 bg-blue-700 hover:bg-blue-800 border border-gray-900 rounded-md shadow-md text-xl font-semibold">
                        Browse ScienceHub
                    </Link>
                </div>
            </div>
        </div>
    );
}
