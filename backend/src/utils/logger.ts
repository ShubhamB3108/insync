export const logger = {
    info:(message:string):void => {
        console.log(`[INFO]-> ${message}`)
    },
    error:(error:string) =>{
        console.log(`[ERROR]-> ${error}`)
    }
}

