import _ from "lodash";

/*
* Format integer
* */
export function formatInt(number, digits) {
  return new Intl.NumberFormat('en-IN', {'minimumIntegerDigits': digits, useGrouping:false}).format(number);
};

//Check the empty array.
Array.prototype.isAllEmpty = function () {
  for (let i = 0; i < this.length; i++) {
    if (this[i].length)
      return false;
  }
  return true;
};

export function get_lad(carrier, name, datas) {
  if (carrier && carrier.length) {
    let currentType = undefined;
    let currentDefs = [];
    for (let i = 0; i < carrier.length; i++) {
      if (carrier[i].isAllEmpty())
        continue;
      for (let j = 0; j < carrier[i].length; j++) {
        if (j === 0) {
          if (carrier[i][0].trim().length) {
            if (currentType && currentDefs.length) {datas.push({type: name, label: currentType, def: currentDefs});}
            currentType = carrier[i][0].trim();
            currentDefs = [];
          }
        }
        else if (carrier[i][j].trim().length) {
          currentDefs.push(carrier[i][j].trim());
        }
      }
    }
    if (currentType && currentDefs.length) {
      datas.push({
        type: name,
        label: currentType,
        def: currentDefs
      });
    }

    return datas;
  }
}

export function push_cpr(column, value) {
  let defs = value.DEF.split(",").splice(1);
  column = column.concat(_.chunk(defs, 7).map((arr, index) => {
    arr = arr.concat(Array(7 - arr.length).fill(""));
    arr.unshift(index === 0 ? value.LBL : "");
    return arr;
  }));
  return column;
}

export function handle_lad (ev, state) {
  let indexes = ev.target.name.split("_");
  let newArray = state.map(function (arr) {
    return arr.slice();
  });
  let row = indexes[1];
  let col = indexes[2];

  let valArray = ev.target.value.split(" ");
  

  if(valArray.length > 1) {
    valArray.forEach((item, index) => {
      let isRow = false;
      newArray[row][col] = item;  col++;
      if(col > 7) {
        row++; col = 1;
        isRow = true
      }
      if(row == newArray.length && valArray.length != (index + 1)) {
        newArray.push(Array(8).fill(""));
      }
    });
  } else {
    newArray[row][col] = ev.target.value;
    if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
      newArray.push(Array(11).fill(""));
    }
  }
  return newArray;
}

export function delete_cell(data) {
  let newArray = data.map(function (arr) {
    return arr.slice();
  });
  newArray.splice(data.length - 1, 1);
  return newArray;
}

export function insert_cell(data) {
  let newArray = data.slice(0);
  newArray.push(Array(data[0].length).fill(""));
  return newArray;
}

export function handle_value_cpr(ev, state) {
  let indexes = ev.target.name.split("_");
  let newArray = state.map(function (arr) {
    return arr.slice();
  });
  let row = indexes[0];
  let col = indexes[1];
  newArray[row][col] = ev.target.value;
  if (row === newArray.length - 1 && col === newArray[0].length - 1 && ev.target.value) {
    newArray.push(Array(11).fill(""));
  }
  console.log(newArray);
  return newArray;
}

export function handle_change(ev, state) {
  let name = ev.target.name.split("_");
  let newArray = state.map(function (arr) {return arr.slice();});
  newArray[name[1]] = ev.target.value;
  return newArray;
}

export function fixed_date (sfed, now) {
  let fixed_date = '';
  if (sfed !== null && !now) {
    let date = sfed.format("MM/DD/YY hh:mm A").toString();
    date = date.split(" ");
    if (date[2] === "AM") {
      fixed_date = date[0] + " " + date[1] + "A/C";
    } else if (date[2] === "PM") {
      fixed_date = date[0] + " " + date[1] + "P/C";
    }
  } else {fixed_date = "NOW";}
  return fixed_date;
}

export function cleanLocalStorage(type) {
  if (type === "CPR") {
    localStorage.setItem("gridType", JSON.stringify(Array(8).fill('')));
    localStorage.setItem("gridData", JSON.stringify(Array(5).fill(Array(8).fill(''))));  
  } else if (type === "LAD") {
    localStorage.setItem("gridSD", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.setItem("gridTD", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.setItem("gridLATA", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.setItem("gridArea", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.setItem("gridDate", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.setItem("gridState", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.setItem("gridNXX", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.setItem("gridTime", JSON.stringify(Array(7).fill(Array(8).fill(''))));
    localStorage.removeItem("isTime");
    localStorage.removeItem("isSD");
    localStorage.removeItem("isTD");
    localStorage.removeItem("isLATA");
    localStorage.removeItem("isDate");
    localStorage.removeItem("isState");
    localStorage.removeItem("isArea");
    localStorage.removeItem("isNXX");
    localStorage.removeItem("disable");
    localStorage.removeItem("template");
    localStorage.removeItem("iec");
    localStorage.removeItem("iac");
  }
}
