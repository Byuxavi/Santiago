document.addEventListener("DOMContentLoaded", function () {
    const pricing = {
        basePrices: {
            "Standard Cleaning": { price: 50, duration: "2h 40min" },
            "Deep Cleaning": { price: 70, duration: "3h 30min" },
            "Post-Construction Cleaning": { price: 80, duration: "4h 00min" },
            "Office Cleaning": { price: 50, duration: "2h 40min" }
        },
        bedrooms: { "Studio": 0, "1 Bedroom": 5, "2 Bedrooms": 10, "3 Bedrooms": 15, "4+ Bedrooms": 20 },
        bathrooms: { "1 Bathroom": 0, "2 Bathrooms": 10, "3 Bathrooms": 20, "4+ Bathrooms": 30 },
        floors: { "1 Floor": 0, "2 Floors": 5, "3 Floors": 10, "4+ Floors": 15 },
        propertyType: { "Apartment": 0, "House": 15, "Townhouse": 20, "Villa": 30, "Other": 10 },
        extras: {
            "Capri & Cool Diffuser": 12,
            "Shower Glass Descaler": 18,
            "Bathroom Deep Clean": 25,
            "Kitchen Deep Clean": 30,
            "Mattress Cleaning": 20,
            "Basic Mold Removal (Per Room)": 25,
            "Yard Cleaning": 35,
            "Sofa Cleaning": 20,
            "Window Cleaning": 15,
            "BBQ Cleaning": 20,
            "Quilt Wash": 20
        },
        areaFees: { "Central": 1.1, "North": 1.15, "South": 1.15, "Other": 1 },
        frequencyDiscounts: { "One-Time": 0, "Daily": 0.20, "Weekly": 0.10, "Every Two Weeks": 0.05, "Monthly": 0.03 },
        taxRate: 1.18 // 18% IVA
    };

    // Obtener elementos del DOM
    const serviceSelect = document.getElementById("service");
    const bedroomSelect = document.getElementById("bedrooms");
    const bathroomSelect = document.getElementById("bathrooms");
    const floorSelect = document.getElementById("floors");
    const propertySelect = document.getElementById("propertyType");
    const areaSelect = document.getElementById("area");
    const frequencyButtons = document.querySelectorAll(".buttons button");

    // Elementos del resumen
    const summaryService = document.querySelector(".summary li:nth-child(2) span:last-child");
    const summaryBedrooms = document.getElementById("summary-bedrooms");
    const summaryBathrooms = document.getElementById("summary-bathrooms");
    const summaryFloors = document.getElementById("summary-floors");
    const summaryProperty = document.getElementById("summary-property");
    const summaryExtras = document.getElementById("summary-extras");
    const summaryDuration = document.getElementById("summary-duration");
    const summaryArea = document.createElement("li");
    summaryArea.innerHTML = `<span>Area:</span> <span id="summary-area"></span>`;
    document.querySelector(".summary ul").appendChild(summaryArea);
    const summaryFrequency = document.createElement("li");
    summaryFrequency.innerHTML = `<span>Frequency:</span> <span id="summary-frequency"></span>`;
    document.querySelector(".summary ul").appendChild(summaryFrequency);

    const totalBeforeTaxes = document.getElementById("total-before-taxes");
    const finalPrice = document.getElementById("final-price");

    // Manejo de extras
    const extras = document.querySelectorAll(".extra-item");
    const selectedExtras = new Set();
    let selectedFrequency = "One-Time"; // Frecuencia por defecto

    function getValidPrice(category, key, subKey = null) {
        return subKey ? pricing[category]?.[key]?.[subKey] ?? 0 : pricing[category]?.[key] ?? 0;
    }

    function calculateTotal() {
        let service = serviceSelect.value;
        let total = getValidPrice("basePrices", service, "price");
        let duration = getValidPrice("basePrices", service, "duration");
        total += getValidPrice("bedrooms", bedroomSelect.value); // Ahora suma correctamente el precio de bedrooms
        total += getValidPrice("bathrooms", bathroomSelect.value);
        total += getValidPrice("floors", floorSelect.value);
        total += getValidPrice("propertyType", propertySelect.value);

        let extrasTotal = Array.from(selectedExtras).reduce((sum, extra) => sum + getValidPrice("extras", extra), 0);

        // Aplicar tarifa de área
        let areaMultiplier = getValidPrice("areaFees", areaSelect.value) || 1;
        let totalBeforeDiscounts = (total + extrasTotal) * areaMultiplier;

        // Aplicar descuento por frecuencia
        let discount = pricing.frequencyDiscounts[selectedFrequency] * totalBeforeDiscounts;
        let totalAfterDiscounts = totalBeforeDiscounts - discount;

        // Aplicar impuestos
        let finalTotal = totalAfterDiscounts * pricing.taxRate;

        return { totalBeforeDiscounts, finalTotal, duration, discount };
    }

    function formatPrice(value) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(value);
    }

    function updateSummary() {
        let { totalBeforeDiscounts, finalTotal, duration, discount } = calculateTotal();

        summaryService.textContent = serviceSelect.value;
        summaryBedrooms.textContent = bedroomSelect.value;
        summaryBathrooms.textContent = bathroomSelect.value;
        summaryFloors.textContent = floorSelect.value;
        summaryProperty.textContent = propertySelect.value;
        summaryDuration.textContent = duration;
        document.getElementById("summary-area").textContent = areaSelect.value;
        document.getElementById("summary-frequency").textContent = selectedFrequency;
        summaryExtras.textContent = selectedExtras.size > 0 ? Array.from(selectedExtras).join(", ") : "None";

        totalBeforeTaxes.textContent = formatPrice(totalBeforeDiscounts);
        finalPrice.textContent = formatPrice(finalTotal);
    }

    // Escuchar cambios en los selects
    [serviceSelect, bedroomSelect, bathroomSelect, floorSelect, propertySelect, areaSelect].forEach(select => {
        select.addEventListener("change", updateSummary);
    });

    // Manejo de extras con delegación de eventos
    document.getElementById("extras-container").addEventListener("click", function (e) {
        if (e.target.classList.contains("extra-item")) {
            const extraName = e.target.getAttribute("data-name");

            if (selectedExtras.has(extraName)) {
                selectedExtras.delete(extraName);
                e.target.classList.remove("selected");
            } else {
                selectedExtras.add(extraName);
                e.target.classList.add("selected");
            }

            updateSummary();
        }
    });

    // Manejo de la frecuencia con botones
    frequencyButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Quitar la clase "active" de todos los botones
            frequencyButtons.forEach(btn => btn.classList.remove("active"));
            // Agregar clase "active" al botón seleccionado
            button.classList.add("active");
            selectedFrequency = button.textContent.trim(); // Actualizar la frecuencia seleccionada
            updateSummary(); // Recalcular el precio
        });
    });
    updateSummary(); // Calcular precio inicial
});
