let confirmCallback = null;

function showToast(message, type = "success") {

    const toastBody = document.getElementById("toastBody");
    const toastElement = document.getElementById("appToast");

    toastBody.innerText = message;

    toastElement.classList.remove("text-bg-success");
    toastElement.classList.remove("text-bg-danger");
    toastElement.classList.remove("text-bg-warning");

    if (type === "success") {
        toastElement.classList.add("text-bg-success");
    } else if (type === "error") {
        toastElement.classList.add("text-bg-danger");
    } else {
        toastElement.classList.add("text-bg-warning");
    }

    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);

    toast.show();

}

function showSuccess(message) {
    showToast(message, "success");
}

function showError(message) {
    showToast(message, "error");
}

function showWarning(message) {
    showToast(message, "warning");
}

function showConfirm(message, callback) {

    confirmCallback = callback;

    document.getElementById("confirmMessage").innerText = message;

    const modal = new bootstrap.Modal(
        document.getElementById("confirmModal")
    );

    modal.show();

}

function confirmYes() {

    if (confirmCallback) {
        confirmCallback();
    }

    bootstrap.Modal
        .getInstance(document.getElementById("confirmModal"))
        .hide();

}
async function initializeCommonUI() {

    const response = await fetch("/components/ui.html");

    const html = await response.text();

    document.body.insertAdjacentHTML("beforeend", html);

}