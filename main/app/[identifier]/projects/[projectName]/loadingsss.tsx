// "use client";

// import ProjectPanel from "@/components/complex-elements/sidebars/ProjectPanel";
// import dynamic from "next/dynamic";
// const Skeleton = dynamic(() =>
//     import("@/components/ui/skeleton").then((mod) => mod.Skeleton)
// );

// export default function ProjectOverviewLoadingPage({
//     params,
// }: {
//     params: { identifier: string; projectName: string };
// }) {
//     return (
//         <>
//             {/* Page Content */}
//             <div className="flex pl-4">
//                 <div className="flex-1 mt-4 mr-4">
//                     {/* Description */}
//                     <div className="border rounded-lg shadow-lg col-span-2">
//                         <div
//                             className="text-gray-900 text-lg font-semibold py-2 px-4 rounded-t-lg border-b border-gray-200"
//                             style={{
//                                 backgroundColor: "var(--page-header-bg-color)",
//                                 fontWeight: "500",
//                                 fontSize: "18px",
//                             }}
//                         >
//                             Description
//                         </div>

//                         <Skeleton className="w-full h-8 bg-gray-400 ml-2" />
//                     </div>
//                 </div>

//                 {/* <ProjectPanel metadata={{}} /> */}
//             </div>
//             <div className="h-10"></div>
//         </>
//     );
// }
