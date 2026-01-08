console.log("THIS IS THE REAL MAIN.JS v9-final take1");

// ===============================
// 1. mainブロックの定義
// ===============================
Blockly.Blocks['main_block'] = {
  init: function() {
    this.appendStatementInput("BODY")
        .appendField("main()");
    this.setColour(230);
    this.setDeletable(false);
    this.setMovable(false);
  }
};

// ===============================
// 2. code_block の定義
// ===============================
Blockly.Blocks['code_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Pythonコード");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "CODE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  }
};

// ===============================
// 3. Blockly 初期化
// ===============================
const workspace = Blockly.inject('workspace', {
  toolbox: document.getElementById('toolbox'),
  scrollbars: true,
  trashcan: true
});

// ===============================
// 4. main ブロックを生成
// ===============================
(function createMainBlock() {
  const block = workspace.newBlock('main_block');
  block.initSvg();
  block.render();
  block.moveBy(20, 20);
})();

// ===============================
// 5. Pyodide 初期化
// ===============================
let pyodideReady = false;
let pyodide = null;

(async () => {
  pyodide = await loadPyodide();
  pyodideReady = true;
  console.log("Pyodide loaded");
})();

// ===============================
// 6. Python generator（v9 用）
// ===============================
Blockly.Python['code_block'] = function(block) {
  const code = block.getFieldValue('CODE') || "";
  return Blockly.Python.prefixLines(code, "    ") + "\n";
};

Blockly.Python['main_block'] = function(block) {
  const body = Blockly.Python.statementToCode(block, 'BODY');
  return "def main():\n" +
         Blockly.Python.prefixLines(body, "    ") +
         "\nmain()\n";
};

// ===============================
// 7. 実行ボタン
// ===============================
document.getElementById("run").addEventListener("click", async () => {
  if (!pyodideReady) return alert("Python 読み込み中…");

  const code = Blockly.Python.workspaceToCode(workspace);
  const consoleEl = document.getElementById("console");
  consoleEl.textContent = "";

  // Pyodide の print 出力をコンソールに流す
  pyodide.setStdout({
    batched: (msg) => {
      consoleEl.textContent += msg;
    }
  });

  pyodide.setStderr({
    batched: (msg) => {
      consoleEl.textContent += "エラー: " + msg;
    }
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    consoleEl.textContent += "エラー: " + err + "\n";
  }
});

// ===============================
// 8. コード表示ボタン
// ===============================
document.getElementById("show-code").addEventListener("click", () => {
  const code = Blockly.Python.workspaceToCode(workspace);
  const modal = document.getElementById("code-modal");
  modal.textContent = code;
  modal.style.display = "block";
  modal.onclick = () => modal.style.display = "none";
});
