class Congress {
    constructor(){
        this.target = document.querySelector('#congress-container');
        this.url = 'https://theunitedstates.io/congress-legislators/legislators-current.json';
        this.target.innerHTML = "<p>Please wait while data loads.</p>"; 
        this.currentName = '';      
            fetch(this.url)
            .then(res=>res.json())
            .then(data=>{
                console.log('data loaded');
                this.fullData = data;
                this.init();
                })
                .catch(e=>{
                this.target.innerHTML = '<p>The data could not be loaded. <br>Please check URL is correct.</p>';            
            });   
    }

    init(){
        // let user know data has loaded
        // create stateSet and statesList
        // 
        if(this.fullData){
            this.target.innerHTML = "<p>Data has loaded...</p>";
            this.mkStatesList();
            this.mkNameSelector();

            this.mkSelectorSection();
        }else{
            this.target.innerHTML = '<p>The data could not be loaded.</p>';
        }
    }

    mkStatesList(){
        const stateSet = new Set();
        this.fullData.forEach(record =>{
            const lastTerm = record.terms[record.terms.length -1];
            stateSet.add(lastTerm.state);
        });
        const statesList = Array.from(stateSet).sort();
        this.statesList = statesList;
    }

    mkSelectorSection(){
        const self = this;
        const stSelSect = document.createElement('section');
        stSelSect.id="state-select-section";
        const stResSect = document.createElement('div');
        stResSect.id = 'state-results-section';
        const stateSelector = document.createElement('select');
        stateSelector.id="state-selector";

        const btnStateSelector = document.createElement('button');
        btnStateSelector.id="btn-state-selector";
        btnStateSelector.textContent = "GET DATA";
        const stateOpt = document.createElement('option');
        stateOpt.id = 'no-id';
        stateOpt.className = "state-opt";
        stateOpt.textContent = "Select State";
        stateSelector.appendChild(stateOpt);
        this.statesList.forEach(state =>{
            const stateOpt = document.createElement('option');
            stateOpt.id = state;
            stateOpt.className = "state-opt";
            stateOpt.textContent = state;
            stateSelector.appendChild(stateOpt);        
        });
        stSelSect.appendChild(stateSelector);
        stSelSect.appendChild(btnStateSelector);
        stSelSect.appendChild(stResSect);
        this.target.appendChild(stSelSect);
        // set event listener for state selector
        btnStateSelector.addEventListener('click', function(e){
            const stateValue = document.querySelector('#state-selector').value;
            self.getState(stateValue);
        } ,false);
    }

    mkNameSelector(){
        const self = this;
        const nmSelSect = document.createElement('section');
        nmSelSect.id = 'name-select-section';
        const nameSelector = document.createElement('input');
        nameSelector.type = 'text';
        nameSelector.id = 'name-selector';
        nameSelector.setAttribute('placeholder', 'Enter Name');
        const btnNameSelector =document.createElement('button');
        btnNameSelector.id = 'btn-name-selector';
        btnNameSelector.textContent = "LOOKUP";
        const nmSelDisplay = document.createElement('div');
        nmSelDisplay.id = "name-select-display";

        nmSelSect.appendChild(nameSelector);
        nmSelSect.appendChild(btnNameSelector);
        nmSelSect.appendChild(nmSelDisplay);

        this.target.appendChild(nmSelSect);
        // set event listener for name selector
        nameSelector.addEventListener('keyup', function(e){
           this.currentName = nameSelector.value;
            self.getName(this.currentName);
        });
    }

    getState(state){
        this.currentState = [];
        this.fullData.forEach(record=>{
            const lastTerm = record.terms[record.terms.length -1];
            if(lastTerm.state === state){
                this.currentState.push(record);
            }
        });
        this.createStateOutput();
    }

    getName(name){
        name = name.toLowerCase();
        const output = document.querySelector('#name-select-display');
        output.innerHTML = '';
        if(name !== ''){
            this.fullData.forEach(record=>{
                const curTerm = record.terms[record.terms.length-1];
                if(record.name.official_full.toLowerCase().includes(name)){
                    console.log(record);
                    const nameSect = document.createElement('h3');
                    nameSect.textContent = record.name.official_full;
                    nameSect.textContent += ' - ';
                    nameSect.textContent += curTerm.state;
                    nameSect.innerHTML += ` | <a href="tel:${curTerm.phone}">${curTerm.phone}</a>`;
                    output.appendChild(nameSect);
                }
            });
        }
    }

    createStateOutput(){
        if(this.currentState){
            const cs = this.currentState;
            const target = document.querySelector('#state-results-section');
            target.innerHTML = '';
            cs.forEach(member=>{
                const curTerm = member.terms[member.terms.length - 1];
                const mem = {};
                mem.name = member.name.official_full;
                mem.state = curTerm.state;
                mem.party = curTerm.party;
                mem.phone = curTerm.phone;
                mem.address = curTerm.address;
                mem.url = curTerm.url || 'n/a';
                if(curTerm.type === 'sen'){
                    mem.type = "Senator";
                }else if(curTerm.type === 'rep'){
                    mem.type = "Representative";
                }else{
                    mem.type = "unknown";
                }
                this.outputter(mem);
            });

        }else{
            console.log('An error occured in "createStateOutput".');
        }
    }

    outputter(mem){
        const target = document.querySelector('#state-results-section');
        const article = document.createElement('article');
        article.className = 'member-data';
        article.id = `article-${mem.phone}`;
        const basicInfo = document.createElement('p');
        basicInfo.className = 'basic-info';
        basicInfo.innerHTML = `<strong>${mem.state} ${mem.party} ${mem.type}</strong>`;
        const memName = document.createElement('p');
        memName.className = 'member-name';
        memName.innerHTML = `<strong>${mem.name}</strong>`;

        const memDetails = document.createElement('div');
        memDetails.className = 'member-details';
        const memDetailsList = document.createElement('ul');
        // PHONE
        const memPhone = document.createElement('li');
        memPhone.className = 'mem-phone';
        memPhone.textContent = 'Phone: ';
        const memPhoneLink = document.createElement('a');
        memPhoneLink.href = `tel:${mem.phone}`;
        memPhoneLink.textContent = mem.phone;
        memPhone.appendChild(memPhoneLink);
        memDetails.appendChild(memPhone);
        // ADDRESS
        const memAddress = document.createElement('li');
        memAddress.className = 'mem-address';
        memAddress.textContent = 'Address: ';
        memAddress.textContent += mem.address;
        memDetails.appendChild(memAddress);
        // URL if(url)...
        if(mem.url !== 'n/a'){
            console.log(mem.url);
            const memURL = document.createElement('li');
            memURL.className = 'mem-url';
            const memUrlLink = document.createElement('a');
            memUrlLink.href = mem.url;
            memUrlLink.textContent = "WEBSITE";
            memURL.appendChild(memUrlLink);
            memDetails.appendChild(memURL);
        }
        article.appendChild(basicInfo);
        article.appendChild(memName);
        article.appendChild(memDetails);
        target.appendChild(article);
    }
}

let xyz = new Congress();


