import utils from '../services/utils.js';
import treeUtils from "../services/tree_utils.js";
import importService from "../services/import.js";

const $dialog = $("#import-dialog");
const $form = $("#import-form");
const $noteTitle = $dialog.find(".import-note-title");
const $fileUploadInput = $("#import-file-upload-input");
const $importButton = $("#import-button");
const $safeImportCheckbox = $("#safe-import-checkbox");
const $shrinkImagesCheckbox = $("#shrink-images-checkbox");
const $textImportedAsTextCheckbox = $("#text-imported-as-text-checkbox");
const $codeImportedAsCodeCheckbox = $("#code-imported-as-code-checkbox");
const $explodeArchivesCheckbox = $("#explode-archives-checkbox");

let parentNoteId = null;

export async function showDialog(node) {
    utils.closeActiveDialog();

    $fileUploadInput.val('').change(); // to trigger Import button disabling listener below

    $safeImportCheckbox.prop("checked", true);
    $shrinkImagesCheckbox.prop("checked", true);
    $textImportedAsTextCheckbox.prop("checked", true);
    $codeImportedAsCodeCheckbox.prop("checked", true);
    $explodeArchivesCheckbox.prop("checked", true);

    glob.activeDialog = $dialog;

    parentNoteId = node.data.noteId;

    $noteTitle.text(await treeUtils.getNoteTitle(parentNoteId));

    $dialog.modal();
}

$form.submit(() => {
    // disabling so that import is not triggered again.
    $importButton.attr("disabled", "disabled");

    importIntoNote(parentNoteId);

    return false;
});

async function importIntoNote(parentNoteId) {
    const files = Array.from($fileUploadInput[0].files); // shallow copy since we're resetting the upload button below

    const options = {
        safeImport: boolToString($safeImportCheckbox),
        shrinkImages: boolToString($shrinkImagesCheckbox),
        textImportedAsText: boolToString($textImportedAsTextCheckbox),
        codeImportedAsCode: boolToString($codeImportedAsCodeCheckbox),
        explodeArchives: boolToString($explodeArchivesCheckbox)
    };

    $dialog.modal('hide');

    await importService.uploadFiles(parentNoteId, files, options);
}

function boolToString($el) {
    return $el.is(":checked") ? "true" : "false";
}

$fileUploadInput.change(() => {
    if ($fileUploadInput.val()) {
        $importButton.removeAttr("disabled");
    }
    else {
        $importButton.attr("disabled", "disabled");
    }
});
