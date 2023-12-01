// import { FullFeature } from "@/types/utilsTypes";
// import { IconDefinition, faQuestion } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Link from "next/link";

// type FeatureBoxProps<T> = {
//     fullFeature: FullFeature<T>;
//     object: T;
//     isLast: boolean;
//     size?: "small" | "medium" | "large";
//     className?: string;
//     children?: React.ReactNode;
//     useText?: boolean;
// };

// const FeatureBox = <T,>({
//     fullFeature,
//     object,
//     isLast,
//     size = "small",
//     className = "",
//     useText = true,
// }: FeatureBoxProps<T>) => {
//     const value = fullFeature.key ? (object as any)[fullFeature.key] : null;

//     // Conditional styles based on the size prop
//     let fontSize, padding;
//     switch (size) {
//         case "small":
//             fontSize = "1em";
//             padding = "px-2 py-1";
//             break;
//         case "medium":
//             fontSize = "1.2em";
//             padding = "px-3 py-2";
//             break;
//         case "large":
//             fontSize = "2em";
//             padding = "px-4 py-3";
//             break;
//         default:
//             fontSize = "1em";
//             padding = "px-2 py-1";
//             break;
//     }

//     return (
//         <div
//             className={`border-2 border-gray-300 rounded-lg flex flex-shrink-0 text-sm mx-1 my-1 ${size} ${className}`}
//         >
//             <div className={`flex items-center ${padding}`}>
//                 <FontAwesomeIcon
//                     icon={fullFeature.feature.icon || faQuestion}
//                     style={{
//                         fontSize: fontSize,
//                         marginLeft: "0.2em",
//                         marginRight: "0.25em",
//                     }}
//                     color={fullFeature.feature.color}
//                     className={`small-icon ${size}`}
//                 />
//                 {fullFeature.link ? (
//                     <Link href={fullFeature.link}>
//                         {useText ? (
//                             <span style={{ fontSize: fontSize }}>
//                                 {fullFeature.feature.label}
//                             </span>
//                         ) : null}
//                     </Link>
//                 ) : (
//                     <span style={{ fontSize: fontSize }}>
//                         {fullFeature.feature.label}
//                     </span>
//                 )}
//             </div>
//             <div
//                 className={`border-l border-gray-400 font-semibold ${padding}`}
//             >
//                 {typeof value === "string" || typeof value === "number"
//                     ? String(value)
//                     : 0}
//             </div>
//         </div>
//     );
// };

// export default FeatureBox;
