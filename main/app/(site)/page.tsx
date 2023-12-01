import Image from "next/image";

// export const revalidate = 0;

const dummyFunction = () => {};

export default async function Home() {
    const aspect_ratio = 0.639;

    return (
        <div
            className="flex flex-col h-screen"
            style={{
                background: "var(--main-content-bg-color)",
                color: "var(--main-content-bg-text-color)",
            }}
        >
            {/* Background Image */}
            <div
                className="relative z-0"
                style={{ paddingTop: `${(1 / aspect_ratio) * 100}%` }}
            >
                <Image
                    src="/images/alexander-andrews-fsH1KjbdjE8-unsplash.jpg"
                    alt="ScienceHub background"
                    fill={true}
                    style={{ objectFit: "contain" }}
                />
            </div>
            <div>Home!</div>
        </div>
    );
}
