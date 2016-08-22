var View = {
    render: function(templateName, model) {
        templateName = templateName + 'Template';

        var templateElement = document.getElementById(templateName),
            templateSource = templateElement.innerHTML,
            renderFn = Handlebars.compile(templateSource);
console.log(renderFn(model));
        return renderFn(model);
    }
};
