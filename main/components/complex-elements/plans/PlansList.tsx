import { HookResult } from "@/hooks/fetch/useGeneralData";
import { Plan } from "@/types/utilsTypes";
import VisibilityTag from "../../elements/VisibilityTag";

interface PlansListProps {
    plansData: HookResult<Plan>;
}

/**
 * Component to display a list of plans. To be improved in the future.
 */
const PlansList: React.FC<PlansListProps> = ({ plansData }) => {
    return (
        <ol className="p-2 space-y-2">
            {plansData.data?.map((plan) => (
                <li key={plan.id} className="flex items-center">
                    <div
                        className={`w-6 h-6 rounded-full border border-gray-400 mr-2 ${plan.color}`}
                    ></div>
                    <div>
                        <div className="flex items-center font-semibold">
                            {plan.title}

                            <VisibilityTag isPublic={plan.public} />
                        </div>

                        <div className="text-sm text-gray-800">{plan.description}</div>
                    </div>
                </li>
            ))}
        </ol>
    );
};

export default PlansList;
