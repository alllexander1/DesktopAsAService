import fetch from "node-fetch"

class PrintRequest{

    constructor(baseUrl){
        this.baseUrl = baseUrl
    }

    async makeRequest(endpoint, options){

    }

    async subscribe(url){
        const response = await fetch('/api/subscribe', {
            method: 'post',
            body: JSON.stringify({'url': url})
        });
        const data = await response.json();
        return data;
    }
    
    async checkForPrinter(id) {
        const response = await fetch('/api/check_for_printer', {
            method: 'post',
            body: JSON.stringify({'id': id})
        });
        const data = await response.json();
        return data;
    }

    async createPrinter(id){
        const response = await fetch('/api/create_printer', {
            method: 'post',
            body: JSON.stringify({'id': id})
        });
        const data = await response.json();
        return data;
    }

    async deletePrinter(id){
        const response = await fetch('/api/delete_printer', {
            method: 'post',
            body: JSON.stringify({'id': id})
        });
        const data = await response.json();
        return data;
    }

}