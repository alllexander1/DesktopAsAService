import PrintClient from "./PrintClient2";

class VNCExtention {

    constructor(audioServerAddr, printServerAddr, desktopAddr, printerId){
        this.audioServerAddr = audioServerAddr;
        this.printServerAddr = printServerAddr;
        this.desktopAddr = desktopAddr;
        this.printerId = printerId;

        this.printClient = null;
    }

    startPrintClient(){
        this.printClient = new PrintClient(this.printServerAddr, this.printerId);
        this.printClient.onStatusChange = (state) => {console.log(state)}
    }



}
export default VNCExtention;