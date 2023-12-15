import { TextDiff } from "@/types/versionControlTypes";
import TextEditor from "../components/TextEditor";

type ProjectTextFieldManagerProps = {
    fields: {
        [key: string]: string; // key: fieldName, value: initialText
    };
    onUpdate: (fieldName: string, newText: string) => void;
};

const ProjectTextFieldManager: React.FC<ProjectTextFieldManagerProps> = ({
    fields,
    onUpdate,
}) => {
    return (
        <>
            {Object.keys(fields).map((fieldName) => (  
                <TextEditor
                    key={fieldName}
                    initialText={fields[fieldName as keyof typeof fields]}
                    onUpdate={(newText) =>
                        onUpdate(fieldName, newText)
                    }
                />
            ))}
        </>
    );
};

export default ProjectTextFieldManager;
