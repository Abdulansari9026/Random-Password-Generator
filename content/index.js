/** @format */

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNum]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// sate strength circle to grey
setIndicater("#cccc");

// set passwordLength
function handleSlider() {
	inputSlider.value = passwordLength;
	lengthDisplay.innerHTML = passwordLength;
	const min = inputSlider.min ;
	const max = inputSlider.max ;

	inputSlider.style.backgroundSize =  ( (passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicater(color) {
	indicator.style.backgroundColor = color;
	// shadow
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber() {
	return getRndInteger(0, 9);
}

function generateRndLowerCase() {
	return String.fromCharCode(getRndInteger(97, 123));
}

function generateRndUpperCase() {
	return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
	const rendom = getRndInteger(0, symbols.length);
	return symbols.charAt(rendom);
}

function calcStrength() {
	let hasUpper = false;
	let hasLower = false;
	let hasNum = false;
	let hasSym = false;
	if (uppercaseCheck.checked) hasUpper = true;
	if (lowercaseCheck.checked) hasLower = true;
	if (numbersCheck.checked) hasNum = true;
	if (symbolsCheck.checked) hasSym = true;

	if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
		setIndicater("#0f0");
	} else if (
		(hasLower || hasUpper) &&
		(hasNum || hasSym) &&
		passwordLength >= 6
	) {
		setIndicater("#ff0");
	} else {
		setIndicater("#f00");
	}
}

async function copyContent() {
	try {
		await navigator.clipboard.writeText(passwordDisplay.value);
		copyMsg.innerText = "copied";
	} catch (e) {
		copyMsg.innerText = "fail";
	}

	// to make copy wala visible
	copyMsg.classList.add("active");

	setTimeout(() => {
		copyMsg.classList.remove("active");
	}, 2000);
}

inputSlider.addEventListener("input", (e) => {
	passwordLength = e.target.value;
	handleSlider();
});

copyBtn.addEventListener("click", () => {
	if (passwordDisplay.value) copyContent();
});

function shufflePassworld(array) {
	//  fisher yet method
	//Fisher Yates Method
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	let str = "";
	array.forEach((el) => (str += el));
	return str;
}

function handleCheckBoxChange() {
	checkCount = 0;
	allCheckBox.forEach((checkbox) => {
		if (checkbox.checked) checkCount++;
	});

	// spceical condition
	if (passwordLength < checkCount) {
		passwordLength = checkCount;
		handleSlider();
	}
}

allCheckBox.forEach((checkbox) => {
	checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
	if (checkCount === 0) return;

	if (passwordLength < checkCount) {
		passwordLength = checkCount;
		handleSlider();
	}

	// let find the new passord find

	// remove the old pass
	password = "";

	//ket's pot the stuff mentioned by check box

	// if(uppercaseCheck.checked){
	//     password += generateRndUpperCase();
	// }

	// if(lowercaseCheck.checked){
	//     password += generateRndLowerCase();
	// }

	// if(numbersCheck.checked){
	//     password += generateRndNumber();
	// }

	// if(symbolsCheck.checked){
	//     password += generateSymbol();
	// }

	let funArr = [];

	if (uppercaseCheck.checked) funArr.push(generateRndUpperCase);

	if (lowercaseCheck.checked) funArr.push(generateRndLowerCase);

	if (numbersCheck.checked) funArr.push(generateRndNumber);

	if (symbolsCheck.checked) funArr.push(generateSymbol);

	// compulory addition

	for (let i = 0; i < funArr.length; i++) {
		password += funArr[i]();
		// console.log("Compulory addition done")
	}

	// remaing adition
	for (let i = 0; i < passwordLength - funArr.length; i++) {
		let randIndex = getRndInteger(0, funArr.length);

		// console.log("randIndex" + randIndex);

		password += funArr[randIndex]();
	}

	// suffle the passworld
	password = shufflePassworld(Array.from(password));

	// show UI
	passwordDisplay.value = password;

	// calculate strength
	calcStrength();
});
