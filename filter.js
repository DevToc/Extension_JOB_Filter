const blackListTagName = ["SCRIPT", "STYLE", "IMG"];
const blackListType = ["clearance", "hybrid", "onsite"];
const whiteList = ['.extension-job-filter', '.toast-job-filter', '[role="search"]', '[aria-label="Edit Clearance Type filter selection"]', '.slider_sub_item'];

let toast = document.createElement("div");
toast.classList.add("toast-job-filter");

// Set the style of the toast
toast.style.position = "fixed";
toast.style.top = "50px";
toast.style.left = "50%";
toast.style.transform = "translateX(-50%)";
toast.style.backgroundColor = "rgb(245, 124, 0)";
toast.style.color = "#fff";
toast.style.padding = "10px";
toast.style.borderRadius = "5px";
toast.style.zIndex = "9999";
toast.style.visibility = "hidden";

function debounce(func, delay) {
	let timeoutId;

	return function () {
		const context = this;
		const args = arguments;

		clearTimeout(timeoutId);
		timeoutId = setTimeout(function () {
			func.apply(context, args);
		}, delay);
	}
}

function closeToast() {
	toast.style.visibility = "hidden";
}

const debouncedCloseToast = debounce(closeToast, 6000);

window.addEventListener("load", function () {
	const observer = new MutationObserver(async (mutations) => {
		const toastElement = document.getElementsByClassName("toast-job-filter");
		if (toastElement.length == 0) {
			document.body.appendChild(toast);
		}
		let elements = document.body.getElementsByTagName("*");
		let blackList = [];

		for (let i = 0; i < elements.length; i++) {
			if (elements[i].children.length === 0 && !blackListTagName.includes(elements[i].tagName)) {
				const parentWhiteListElement = elements[i].closest(whiteList.join(','));
				if (parentWhiteListElement) continue;
				for (let j = 0; j < blackListType.length; j++) {
					if (elements[i].outerHTML.toLowerCase().includes(blackListType[j])) {
						elements[i].classList.add("extension-job-filter");
						elements[i].style.backgroundColor = "red";
						elements[i].style.color = "white";
						if (!blackList.includes(blackListType[j])) blackList.push(blackListType[j]);
						break;
					}
				}
			}
		}

		if (blackList.length) {
			toast.textContent = `${blackList.join(' ')} Exists!`;
			toast.style.visibility = "visible";
			debouncedCloseToast();
		}
	});

	// define the target node to observe
	const targetNode = document;

	// define the observer options
	const observerOptions = {
		childList: true,
		subtree: true,
		characterDataOldValue: true,
		attributes: true,  // observe changes to the attributes (excluding style)
		attributeFilter: ['value'],
	};

	// start observing the target node for changes
	observer.observe(targetNode, observerOptions);
})

window.addEventListener("click", function () {
	if (toast.style.visibility == "visible") closeToast();
})