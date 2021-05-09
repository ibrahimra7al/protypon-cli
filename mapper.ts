import ProtyponSync from "@atypon/protypon-cli/lib/commands/figma/sync";
import ColorsHelper from "./helpers/ColorsHelper";
import FileSystem from "../../util/FileSystem";
import StyleguideUtil from "../../util/Styleguide";
import GenericUtil from "../../util/Generic";

class FigmaSync {
    run() {
        const protypon = new ProtyponSync();
        GenericUtil.withOutLogging(() => {
            protypon.run({
                figma_file: "https://www.figma.com/file/WlYBQEevddp7MObld6Nc7p",
                token: "187206-c045e5e0-403b-4584-9712-aae15c72a02a"
            }).then((content:any) => {
                let generatedFile = `\n\n /* journal branding section */ \n\n`;
                generatedFile += ColorsHelper.brandingHelper(content.colors.branding);
                delete content.colors.branding;
                generatedFile += `\n\n /* Color Groups section */ \n\n`;
                generatedFile += ColorsHelper.colorGroupsHelper(content.colors, StyleguideUtil.workingLevel !== 'product');
                const figmaScssFilePath = FileSystem.resolveRelativeToWorkingDirectory("scss/variables/_figma-variables.scss");
                FileSystem.writeFileSync(figmaScssFilePath, generatedFile);
            })
        });
    }
}

export default (new FigmaSync()).asModule("sync", []);