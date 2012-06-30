FooterTest = (function() {
    return {
        runWithElementExpectUpdated: function() {
            var id = 'test';
            var opacity = 0.8;
            Fenton.footer.addElement(id).run();
            
            var result = document.getElementById(id);
            
            Assert.areIdentical(result.style.display, 'block');
            Assert.areIdentical(result.style.position, 'fixed');
            Assert.areIdentical(result.style.bottom, '0px');
            Assert.areIdentical(result.style.left, '0px');
            Assert.areIdentical(result.style.width, '100%');
        },
        runWithCloseButtonExpectVisible: function () {
            var id = 'test';
            Fenton.footer.addElement(id).showCloseButton().run();
            
            var result = document.getElementById(id + '_close');
            
            Assert.isTruthy(result);
        }
    };
})();

Enhance.discoverTests(FooterTest).runTests();
