module.exports = {
    validate: function(value, condition) {
        if (typeof condition == "function")
            return condition(value);
        if (typeof condition == "string")
            return value.toString() == condition;
        if (typeof condition == "object")
            for (var key in condition) {
                if (key.charAt(0) == "!")
                    return condition[key] != value[key];
                else
                    return condition[key] == value[key];
            }
        if (typeof condition == "boolean")
            return condition;
        return value == condition;
    },

    extends: function(main, base) {
        base = base.property;
        main = main.property;
        for (var name in base) {
            desc = Object.getOwnPropertyDescriptor(base, name);
            sourceDesc = Object.getOwnPropertyDescriptor(main, name);

            if (sourceDesc == undefined)
                Object.defineProperty(main, name, desc)
        }

    }
}