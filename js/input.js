let type1_active = 1;
let type2_active = 1;
let type3_active = 1;
let type4_active = 1;

let midpointMode = false;

function serotypeCheck() {
    type1_active = +document.querySelector('#serotypeCheck_1').checked;
    type2_active = +document.querySelector('#serotypeCheck_2').checked;
    type3_active = +document.querySelector('#serotypeCheck_3').checked;
    type4_active = +document.querySelector('#serotypeCheck_4').checked;
  
    setTimeout(() => {
      updateSymbols(activeYear);
    }, 500); // Wait for 500ms (0.5 seconds) before calling updateSymbols
  }
  



function  midpointModeCheck() {
    midpointMode = document.querySelector('#midpointModeCheck').checked
    updateSymbols(activeYear)
  }