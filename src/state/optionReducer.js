export default function optionreducer(options, action) {
    switch (action.type) {
        case 'switch':
            return options.map(x => {
               x.on = (x.id === action.id)
               return x
            });
        case 'add':
            return [...options, action.option];
        case 'remove':
            return options.filter(x => x.id !== action.id)
        default: 
            throw Error('Unknown action: ' + action.type);
    }
}