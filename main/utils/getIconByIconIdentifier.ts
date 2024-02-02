import { faBox, faBoxArchive, faBriefcase, faGlobe, faQuestion, faSearch, faUser } from "@fortawesome/free-solid-svg-icons"

/**
 * Util for getting FontAwesome component from string
 */
export const getIconByIconIdentifier = (iconIdentifier: string) => {
    switch (iconIdentifier) {
        case "faQuestion":
            return faQuestion;
        case "faUser":
            return faUser;
        case "faBoxArchive":
            return faBoxArchive;
        case "faBriefcase":
            return faBriefcase;
        case "faGlobe":
            return faGlobe;
        case "faSearch":
            return faSearch;
        case "faBox":
            return faBox;
        default:
            return faQuestion;
    }
}