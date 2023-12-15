import List from "@/components/light-simple-elements/List";
import { MenubarItem } from "@/components/light-simple-elements/Menubar";
import { SelectOption } from "@/components/light-simple-elements/Select";

import {
    faBoxArchive,
    faChartSimple,
    faCircleExclamation,
    faCopy,
    faCut,
    faEdit,
    faFile,
    faFolder,
    faFolderOpen,
    faImage,
    faInfoCircle,
    faPaste,
    faRotateLeft,
    faRotateRight,
    faTable,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const getMenubarItems = (): MenubarItem[] => {
    return [
        {
            label: "File",
            children: (
                <List
                    items={[
                        {
                            label: "New",
                            icon: faFile,
                            onClick: () => {},
                            children: (
                                <List
                                    items={[
                                        {
                                            label: "Project",
                                            icon: faBoxArchive,
                                            onClick: () => {},
                                        },
                                        {
                                            label: "Folder",
                                            icon: faFolder,
                                            onClick: () => {},
                                        },
                                        {
                                            label: "Work",
                                            icon: faFile,
                                            onClick: () => {},
                                        },
                                        { label: "Submission", icon: faPaste },
                                        {
                                            label: "Issue",
                                            icon: faCircleExclamation,
                                        },
                                        { label: "Review", icon: faEdit },
                                    ]}
                                />
                            ),
                        },
                        {
                            label: "Open",
                            icon: faFolderOpen,
                            children: (
                                <List
                                    items={[
                                        {
                                            label: "Project",
                                            icon: faBoxArchive,
                                        },
                                        {
                                            label: "Work",
                                            icon: faFile,
                                        },
                                        { label: "Submission", icon: faPaste },
                                        {
                                            label: "Issue",
                                            icon: faCircleExclamation,
                                        },
                                        { label: "Review", icon: faEdit },
                                    ]}
                                />
                            ),
                        },
                        { label: "Delete", icon: faTrash, children: (
                            <List
                                items={[
                                    {
                                        label: "Project",
                                        icon: faBoxArchive,
                                    },
                                    {
                                        label: "Work",
                                        icon: faFile,
                                    },
                                    { label: "Submission", icon: faPaste },
                                    {
                                        label: "Issue",
                                        icon: faCircleExclamation,
                                    },
                                    { label: "Review", icon: faEdit },
                                ]}
                            />
                        ), },
                    ]}
                />
            ),
        },
        {
            label: "Edit",
            children: (
                <List
                    items={[
                        { label: "Undo", icon: faRotateLeft },
                        { label: "Redo", icon: faRotateRight },
                        { label: "Cut", icon: faCut },
                        { label: "Copy", icon: faCopy },
                        { label: "Paste", icon: faPaste },
                    ]}
                />
            ),
        },
        {
            label: "Insert",
            children: (
                <List
                    items={[
                        { label: "Image", icon: faImage },
                        { label: "Table", icon: faTable },
                        { label: "Chart", icon: faChartSimple },
                    ]}
                />
            ),
        },
        { label: "Tools", children: <List items={[]} /> },
        { label: "Help", children: <List items={[]} /> },
    ];
} 

// Predefined options
export const textColorOptions: SelectOption[] = [
    { label: "Black", value: "black" },
    { label: "White", value: "white" },
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
    { label: "Green", value: "green" },
    { label: "Yellow", value: "yellow" },
];

export const textSizeOptions: SelectOption[] = [
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "14", value: "14" },
    { label: "18", value: "18" },
    { label: "24", value: "24" },
    { label: "30", value: "30" },
    { label: "36", value: "36" },
    { label: "48", value: "48" },
    { label: "60", value: "60" },
    { label: "72", value: "72" },
    { label: "96", value: "96" },
];

export const fontOptions: SelectOption[] = [
    { label: "Arial", value: "Arial" },
    { label: "Merriweather", value: "Merriweather" },
    { label: "Inter", value: "Inter" },
    { label: "Serif", value: "serif" },
];

export const headingOptions: SelectOption[] = [
    { label: "Normal text", value: "0" },
    { label: "Heading 1", value: "1" },
    { label: "Heading 2", value: "2" },
    { label: "Heading 3", value: "3" },
    { label: "Heading 4", value: "4" },
    { label: "Heading 5", value: "5" },
];
