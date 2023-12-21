// "use client";

// import React, { useContext } from 'react';

// // Needs to be updated once the (new UnifiedEditor - version control system) integration is established
// export type ProjectEditModeContextType = {
//     isEditModeOn: boolean;
//     projectId: number | null;
//     projectSubmissionId: number | null;
//     toggleEditMode: () => void;
//     setProjectId: React.Dispatch<React.SetStateAction<number | null>>;
//     setProjectSubmissionId: React.Dispatch<React.SetStateAction<number | null>>;
// };

// export const ProjectEditModeContext = React.createContext<ProjectEditModeContextType | undefined>(
//     undefined
// );

// export const useProjectEditModeContext = (): ProjectEditModeContextType => {
//     const context = useContext(ProjectEditModeContext);
//     if (!context) {
//         throw new Error("Please use ProjectEditModeContext within an ProjectEditModeContextProvider");
//     };
//     return context;
// }

// export const ProjectEditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [isEditModeOn, setEditMode] = React.useState(false);
//     const [projectId, setProjectId] = React.useState<number | null>(null);
//     const [projectSubmissionId, setProjectSubmissionId] = React.useState<number | null>(0);

//     const toggleEditMode = () => {
//         setEditMode(!isEditModeOn);
//     };

//     return (
//         <ProjectEditModeContext.Provider
//             value={{
//                 isEditModeOn,
//                 projectId,
//                 projectSubmissionId, 
//                 toggleEditMode,
//                 setProjectId,
//                 setProjectSubmissionId
//             }}
//         >
//             {children}
//         </ProjectEditModeContext.Provider>
//     );
// };
