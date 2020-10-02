// each sorting algo will take in a list, and return every step necessary in order to sort that list using specific algo
// for ex
// [2,1,3] -> [[2,1,3],[1,2,3]]
// [3,4,2,1] -> [[3,2,4,1],[3,2,1,4],[2,3,1,4],[2,1,3,4],[1,2,3,4]]
// this way, the visualization part of the program will be able to easily display each step of the way

Array.prototype.insert = function (num, ind) {
	// returns new list with num inserted at index, ind
	let beforeSlice = this.slice(0, ind);
	let afterSlice = this.slice(ind, this.length);

	let returnArray = [];
	beforeSlice.forEach(
		number => returnArray.push(number)
	);
	returnArray.push(num);
	afterSlice.forEach(
		number => returnArray.push(number)
	);
	return returnArray;
}

Array.prototype.max = function () {
	// returns biggest number in list
	let biggest = this[0];
	let i;
	for (i = 0; i < this.length; i++) {
		if (this[i] > biggest) {
			biggest = this[i];
		}
	}
	return biggest;
}

function generateList(min, max, n) {
	let arr = [];
	min = Math.round(min);
	max = Math.round(max);
	for (let i = 0; i < n; i++) {
		let num = Math.floor(Math.random() * max) + min;
		arr.push(num);
	}
	return arr;
}

function selectionSort(arr) {
	let i, j;
	let history = [arr.slice()];

	for (i = 0; i < arr.length; i++) {
		let ind = i;
		for (j = i + 1; j < arr.length; j++) {
			if (arr[j] < arr[ind]) {
				ind = j;
			}
		}
		let num = arr[ind];
		arr.splice(ind, 1);
		arr = arr.insert(num, i);
		history.push(arr.slice());
	}
	return history;
}

function insertionSort(arr) {
	let history = [arr.slice()];

	for (let i = 1; i < arr.length; i++) {
		for (let j = 0; j < i; j++) {
			if (arr[i] < arr[j]) {
				let num = arr[i];
				arr.splice(i, 1);
				arr = arr.insert(num, j);
				history.push(arr.slice());
				break;
			}
		}
	}

	return history;
}

function bubbleSort(arr) {
	let history = [arr.slice()];
	let i = 0;
	let c = 0;
	while (true) {
		if (i > arr.length + 1) {
			if (c == 0) {
				break;
			} else {
				i = 0;
				c = 0;
			}
		}
		if (arr[i] > arr[i + 1]) {
			let num = arr[i + 1];
			arr.splice(i + 1, 1);
			arr = arr.insert(num, i);
			history.push(arr.slice())
			c++;
		}
		i++;
	}
	return history;
}

class SortVisualizer {
	constructor() {
		this.canvasEle = document.getElementById('canv');
		this.canv = this.canvasEle.getContext('2d');

		this.index = 0;
	}

	init(history) {
		this.width = 900;
		this.height = 500;

		this.history = history;
		this.starting = history[0];
		this.totalSteps = history.length;
		this.listLength = history[0].length;

		this.barWidth = this.width / this.listLength;
		this.yMax = this.getBiggestValue();
		this.drawStep()
	}

	getBiggestValue() {
		let biggest = 0;
		let i;
		for (i = 0; i < this.history.length; i++) {
			let max = this.history[i].max();
			if (max > biggest) {
				biggest = max;
			}
		}
		return biggest;
	}

	drawBar(x1, y1, barWidth, barHeight) {
		let width = barWidth - (barWidth * .15);
		x1 += (barWidth * .075);
		if (y1 == 0) {
			y1 = barHeight * .025;
		}
		this.canv.beginPath();
		this.canv.rect(x1, y1, width, barHeight);
		this.canv.fillStyle = 'darkblue';
		this.canv.fill();
	}

	drawStep() {
		this.canv.clearRect(0, 0, this.width, this.height);
		let step = this.history[this.index];

		for (let i = 0; i < step.length; i++) {
			let ratio = step[i] / this.yMax;
			let y = this.height - (ratio * this.height);
			let h = this.height - y;
			let x = (i * this.barWidth);
			let w = this.barWidth;

			this.drawBar(x, y, w, h);

		}
	}
}

let sortObject;
let intervalVar;

function generateSortObject() {
	let max = document.getElementById('max').value;
	let n = document.getElementById('n').value;
	let randomArr = generateList(1, max, n);

	let arrHistory;
	switch (document.getElementById('sorts').value) {
		case 'selectionSort':
			arrHistory = selectionSort(randomArr);
			break;
		case 'bubbleSort':
			arrHistory = bubbleSort(randomArr);
			break;
		case 'insertionSort':
			arrHistory = insertionSort(randomArr);
			break;
	}

	sortObject = new SortVisualizer();
	sortObject.init(arrHistory);
}

function moveForwardAnimation() {
	if (sortObject.index == sortObject.history.length - 1) {
		clearInterval(intervalVar);
		return;
	}
	sortObject.index++;
	sortObject.drawStep();
}

function playAnimation() {
	sortObject.index = 0;
	intervalVar = setInterval(moveForwardAnimation, 75);
}


function moveForward() {
	if (sortObject.index == sortObject.history.length - 1) {
		return;
	} else {
		sortObject.index++;
	}
	sortObject.drawStep();
}

function moveBackward() {
	if (sortObject.index == 0) {
		return;
	} else {
		sortObject.index--;
	}
	sortObject.drawStep();
}