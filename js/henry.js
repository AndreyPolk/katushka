/*
D – средний диаметр катушки, мм
h – высота катушки (длина намотки), мм
g – глубина (толщина намотки) катушки, мм
N – количество витков
L - индуктивность, мкГн
d - внутренний диаметр катушки, мм
r - сопротивление катушки, Ом
f - частота, Гц
Rx - реактивное сопротивление на частоте f, Ом
Q - добротность катушки на частоте f
dp - диаметр провода.

var L = 0.008 * D * D * N * N / ( 3 * D + 9 * h + 10 * g );


*/
var data = {
	L: {val: 10, sel: 2},
	D: {val: 10, sel: 2},
	d: {val: 0.2, sel: 3},
	N: {val: 0, sel: 1},
	h: {val: 10, sel: 2},
	g: {val: 0, sel: 1},
	l: {val: 0, sel: 1},
	r: {val: 0, sel: 1},
	f: {val: 0, sel: 1},
	Rx: {val: 0, sel: 1},
	Q: {val: 0, sel: 1},
	C: {val: 0, sel: 1},
	lay: {val: 0, sel: 3}
};

function toNumber() {
	for(let index in data) {
		data[index].val *= 1;
	}
}

function calculate() {
	toNumber();
	// Если известна ёмкость и индуктивнасть, то найти частоту среза и Rx
	if(data.L.sel != 1 && data.C.sel != 1) {
		data.f.val = 1 / (2 * Math.PI * Math.pow((data.L.val * data.C.val / 1000000000000), 0.5));
		data.Rx.val = 2 * Math.PI * data.f.val * data.L.val / 1000000;
		tableData();
	}
	if(data.L.sel == 2) { // если известна индуктивность
		if(data.D.sel == 2) { // если известен диаметр катушки 
			if(data.h.sel == 2) { // если известна длина намотки
				// нахождение числа витков
				let temp = {};
				let lay = 1; // слой намотки = 1
				let Dd = data.D.val + data.d.val;
				let D1 = Dd;
				let ro = 0.017; // медь
				let h;
				let l = 0;
				let L;
				let D;
				let k = 1.09; // коэффициент для изоляции
				temp.g = data.d.val * lay;
				for(let i = 0; i < 10000; i++) {
					if(data.d.val * k * i >= data.h.val * lay - data.d.val * k / 2) {
						lay += 1;
						Dd += data.d.val * k;	// диаметр витка
						temp.g = data.d.val * k * lay;	//	толщина намотки
					}
					l += Dd * Math.PI * 0.001;	// длина проволоки в метрах
					D = (D1 + Dd) / 2;	// средний диаметр катушки
					h = data.h.val;
					L = 0.008 * D * D * i * i / ( 3 * D + 9 * h + 10 * temp.g );
					if(L >= data.L.val) {
						temp.r = ro * l / (data.d.val * data.d.val * Math.PI / 4);
						temp.l = l;
						temp.h = h;
						temp.N = i;
						temp.Rx = 2 * Math.PI * +data.f.val * L / 1000000;
						temp.Q = temp.Rx / temp.r;
						temp.lay = lay;
						return temp;
					}
				}
			}
		}
	}
}

function tableData() {
	for(let index in data) {
		$("#"+ index).val(data[index].val);
		$("#"+ index).parent().parent().find("select").val(data[index].sel);
	}
}

function setTableData() {
	tableData();
	let result = calculate();
	if(result) {
		for(let index in result) {
			data[index].val = result[index];
		}
		delete result;
		tableData();
	} else {
		alert("нет результата");
	}
}

function getValue() {
	data[this.id].val = this.value;
	if(this.value == 0) {
		data[this.id].sel = 1
	} else {
		data[this.id].sel = 2
	}
	setTableData();
}

$(document).ready(function() {

tableData();

$("form input[type='number']").on("change", getValue);


	
	
});