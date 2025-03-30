document.addEventListener("DOMContentLoaded", () => {
    let filters = new Set();
    const container = document.getElementById("job-list");
    console.log(container);
    const filterBar = document.getElementById("filter-bar");
    filterBar.classList.add("flex", "flex-wrap", "gap-2", );


    async function fetchData() {
        try {
            const response = await fetch("data.json");

            if (!response.ok) throw new Error("Error fetching data");
            // console.log(response);
            const data = await response.json();
            // console.log(data);
            displayData(data);
        } catch (error) {
            console.log(error);
        }
    }
    fetchData();

    function displayData(fetchedData) {
        console.log(fetchedData);
        container.innerHTML = "";
        container.innerHTML = fetchedData.map((eachData) => {
            return `
                <div class="job-card flex items-center w-full bg-white rounded-lg p-6 m-4 shadow-[0_8px_12px_rgba(91,164,164,0.1)] space-y-4 md:space-y-0 relative border-l-8 ${eachData.featured ? 'border-[#5BA4A4]' : 'border-transparent'}">
                    <div class="w-[10%] mr-10 image">
                        <img src="${eachData.logo}" alt="" class="w-12 h-12 md:w-full md:h-full">
                    </div>
                    <div class="lg:w-[20%] space-y-2 flex-grow mt-4 md:mt-0">
                        <div class="flex items-center space-x-2">
                            <h4 class="text-base text-[#5ba4a4] font-bold">${eachData.company}</h4>
                            ${eachData.new ? `<span class="bg-[#5ba4a4] text-[15px] text-white px-2 py-1 text-justify rounded-full">NEW!</span>` : ""}
                            ${eachData.featured ? `<span class="bg-[#2C3A3A] text-[15px] text-white px-2 py-1 text-justify rounded-full">FEATURED</span>` : ""}
                        </div>
                        <div>
                            <h1 class="font-bold text-xl text-[#2C3A3A]">${eachData.position}</h1>
                        </div>
                        <span class="text-[#7B8E8E] text-base">${eachData.postedAt} • ${eachData.contract} • ${eachData.location}</span>
                    </div>
                    <div class="w-[80%] border  border-gray-400 md:hidden"></div>
                    <div class="tags flex flex-wrap items-center space-x-4">
                        <span class="tag text-[#5ba4a4] bg-[#EFFAFA] p-2 font-semibold cursor-pointer hover:bg-[#5BA4A4] hover:text-white rounded-sm" data-filter="${eachData.role}">${eachData.role}</span>
                        <span class="tag text-[#5ba4a4] bg-[#EFFAFA] p-2 font-semibold cursor-pointer hover:bg-[#5BA4A4] hover:text-white rounded-sm" data-filter="${eachData.level}">${eachData.level}</span>
                        ${eachData.languages.map(lang => `<span class="tag bg-[#EFFAFA] text-[#5ba4a4] p-2 font-semibold mr-3 cursor-pointer hover:bg-[#5BA4A4] hover:text-white rounded-sm" data-filter="${lang}">${lang}</span>`).join('')}
                        ${eachData.tools.map(tool => `<span class="tag bg-[#EFFAFA] text-[#5ba4a4] p-2 font-semibold mr-3 cursor-pointer hover:bg-[#5BA4A4] hover:text-white rounded-sm" data-filter="${tool}">${tool}</span>`).join('')}               
                    </div>
                </div>
            `
        }).join("");

        addFilterEventListeners();
    }

    // Event Listeners for filtering
    function addFilterEventListeners() {
        document.querySelectorAll(".tag").forEach((tag) => {
            tag.addEventListener("click", () => {
                filters.add(tag.dataset.filter);
                updateFilterBar();
                applyFilters();
            });
        });
    }

    function updateFilterBar() {
        if (filters.size > 0) {
            filterBar.innerHTML = `
                <div class="filter-container bg-white p-4 w-full rounded-lg flex justify-between items-center shadow-md">
                    <div class="flex flex-wrap gap-2">
                        ${Array.from(filters).map(filter => `
                            <span class="filter-item bg-[#EFFAFA] font-semibold rounded-md flex items-center overflow-hidden">
                                <div class="text-[#5ba4a4] px-2">${filter}</div>
                                <button class="ml-2 bg-[#5ba4a4] px-4 py-2 text-white cursor-pointer flex-grow h-full remove-filter" data-filter="${filter}">✖</button>
                            </span>
                        `).join("")}
                    </div>
                    <button id="clear-filters" class="text-[#5ba4a4] font-bold hover:underline underline-offset-2 cursor-pointer">Clear</button>
                </div>
            `;
            addFilterRemovalListeners();
        } else {
            filterBar.innerHTML = "";
        }
    }

    function addFilterRemovalListeners() {
        document.querySelectorAll(".remove-filter").forEach((btn) => {
            btn.addEventListener("click", () => {
                filters.delete(btn.dataset.filter);
                updateFilterBar();
                applyFilters();
            });
        });

        document.getElementById("clear-filters")?.addEventListener("click", () => {
            filters.clear();
            updateFilterBar();
            applyFilters();
        });
    }

    function applyFilters() {
        document.querySelectorAll(".job-card").forEach((card) => {
            let tags = Array.from(card.querySelectorAll(".tag")).map(tag => tag.dataset.filter);
            let isVisible = [...filters].every(filter => tags.includes(filter));
            card.style.display = isVisible ? "flex" : "none";
        });
    }

});