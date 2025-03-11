let inventory = JSON.parse(localStorage.getItem("inventory")) || {}; // Carrega o estoque do localStorage
        let history = JSON.parse(localStorage.getItem("history")) || [];  // Carrega o histórico do localStorage
        let sharedData = JSON.parse(localStorage.getItem("sharedData")) || []; // Carrega os dados compartilhados
        let alertMessage = document.getElementById("alertMessage");

        function addItem() {
            const code = document.getElementById("productCode").value;
            const name = document.getElementById("itemName").value;
            const quantity = parseInt(document.getElementById("itemQuantity").value);
            const responsible = document.getElementById("responsiblePerson").value;

            // Verifica se todos os campos estão preenchidos
            if (!code || !name || !quantity || !responsible) {
                showAlert("Todos os campos são obrigatórios.", true);
                return;
            }

            // Verifica se a quantidade está correta
            if (quantity <= 0) {
                showAlert("A quantidade deve ser maior que zero.", true);
                return;
            }

            // Adicionando ou atualizando o item no estoque
            if (inventory[code]) {
                inventory[code].quantity += quantity; // Adiciona à quantidade existente
            } else {
                inventory[code] = { name, quantity }; // Novo item sem quantidades mínimas e máximas
            }

            // Adiciona ao histórico
            addHistory(code, name, "Entrada", quantity, responsible);

            // Salva os dados no localStorage
            saveData();
            updateTable();
            clearInputFields();
            showAlert("Produto cadastrado com sucesso!", false);
        }

        function addHistory(code, name, type, quantity, responsible) {
            const date = new Date().toLocaleString();
            history.push({ code, name, type, quantity, responsible, date });
            saveData();
            updateHistoryTable();
        }

        function updateHistoryTable() {
            const tableBody = document.getElementById("historyBody");
            tableBody.innerHTML = "";
            history.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = 
                    `<td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.responsible}</td>
                    <td>${item.date}</td>`;
                tableBody.appendChild(row);
            });
        }

        function saveData() {
            localStorage.setItem("inventory", JSON.stringify(inventory));
            localStorage.setItem("history", JSON.stringify(history));
            localStorage.setItem("sharedData", JSON.stringify(sharedData));
        }

        function showAlert(message, isError) {
            alertMessage.style.display = "block";
            alertMessage.textContent = message;
            alertMessage.className = isError ? "alert error" : "alert success";
            setTimeout(() => {
                alertMessage.style.display = "none";
            }, 3000);
        }

        function updateTable() {
            const inventoryBody = document.getElementById("inventoryBody");
            inventoryBody.innerHTML = "";
            for (let code in inventory) {
                const item = inventory[code];
                const row = document.createElement("tr");
                row.innerHTML = 
                    `<td>${code}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button class="btn-entry" onclick="updateItem('${code}')">Entrada</button>
                        <button class="btn-exit" onclick="removeItem('${code}')">Saída</button>
                        <button class="btn-edit" onclick="editItem('${code}')">Editar</button>
                    </td>`;
                inventoryBody.appendChild(row);
            }
        }

        function showTab(tabId) {
            document.getElementById("estoque").style.display = tabId === 'estoque' ? 'block' : 'none';
            document.getElementById("historico").style.display = tabId === 'historico' ? 'block' : 'none';
            document.getElementById("compartilhado").style.display = tabId === 'compartilhado' ? 'block' : 'none';

            document.querySelectorAll('.menu button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${tabId}Tab`).classList.add('active');
        }

        function filterStock() {
            const filter = document.getElementById("filterProduct").value.toLowerCase();
            const rows = document.querySelectorAll("#inventoryBody tr");
            rows.forEach(row => {
                const name = row.cells[1].textContent.toLowerCase();
                row.style.display = name.includes(filter) ? "" : "none";
            });
        }

        function filterHistory() {
            const filter = document.getElementById("filterHistory").value.toLowerCase();
            const rows = document.querySelectorAll("#historyBody tr");
            rows.forEach(row => {
                const code = row.cells[0].textContent.toLowerCase();
                const name = row.cells[1].textContent.toLowerCase();
                const responsible = row.cells[4].textContent.toLowerCase();
                row.style.display = code.includes(filter) || name.includes(filter) || responsible.includes(filter) ? "" : "none";
            });
        }

        function generateReport() {
            alert("Relatório gerado!");
        }

        function clearInputFields() {
            document.getElementById("productCode").value = "";
            document.getElementById("itemName").value = "";
            document.getElementById("itemQuantity").value = "";
            document.getElementById("responsiblePerson").value = "";
        }
