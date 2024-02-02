(function myCustomConsentIntegration (window) {
  window.tealiumCmpIntegration = window.tealiumCmpIntegration || {}
  window.tealiumCmpIntegration.cmpName = 'Ketch'
  window.tealiumCmpIntegration.cmpIntegrationVersion = 'v0.0.1'
  var disableVendorIdValidation = false;
  
  function cmpFetchCurrentLookupKey () {
    if (disableVendorIdValidation) {
      return (window.tealiumCmpIntegration && window.tealiumCmpIntegration.map && Object.keys(window.tealiumCmpIntegration.map)[0]) || "(Vendor ID check disabled)";
    }
    if(!_config) return '';
    var id = _config.deployment.version;
    return id || '';
  }

  function cmpFetchCurrentConsentDecision () {
    if (!window._consent_choices || !window._config) {
      return false; 
    }
    return {'config': window._config, 'consent': window._consent_choices};
  }

  function cmpCheckIfOptInModel () {
    var decision = cmpFetchCurrentConsentDecision();
    if (decision && decision.config && decision.config.purposes[0].legalBasisCode == 'consent_optin') {
      return true;
    }
    return false;
  }

  function cmpCheckForWellFormedDecision (cmpRawOutput) {
    if (!cmpRawOutput) { 
      return false; 
    }
    if (cmpRawOutput && cmpRawOutput.consent && cmpRawOutput.consent.purposes) {
      return true;
    }
    return false;
  }

  function cmpCheckForExplicitConsentDecision (cmpRawOutput) {
    if (!cmpRawOutput || !cmpRawOutput.consent || !cmpRawOutput.consent.purposes) {
      return false; 
    }
    
    if (Object.keys(cmpRawOutput.consent.purposes).length > 0 && window._explicit_consent) {
      return true;
    }
    return false;
  }

  function cmpCheckForTiqConsent (cmpRawOutput, tiqGroupName) {
    return true;
  }

  function cmpConvertResponseToGroupList (cmpRawOutput) {
    var purposeArray = [];
    
    cmpRawOutput && cmpRawOutput.consent.purposes && Object.keys(cmpRawOutput.consent.purposes).forEach(function (key) {
      if (cmpRawOutput.consent.purposes[key] === true) {
        purposeArray.push(key);
      }
    });
    return purposeArray;
  }

  window.tealiumCmpIntegration.cmpFetchCurrentConsentDecision = cmpFetchCurrentConsentDecision;
  window.tealiumCmpIntegration.cmpCheckIfOptInModel = cmpCheckIfOptInModel;
  window.tealiumCmpIntegration.cmpCheckForWellFormedDecision = cmpCheckForWellFormedDecision;
  window.tealiumCmpIntegration.cmpCheckForExplicitConsentDecision = cmpCheckForExplicitConsentDecision;
  window.tealiumCmpIntegration.cmpCheckForTiqConsent = cmpCheckForTiqConsent;
  window.tealiumCmpIntegration.cmpConvertResponseToGroupList = cmpConvertResponseToGroupList;
  window.tealiumCmpIntegration.cmpFetchCurrentLookupKey = cmpFetchCurrentLookupKey;
  console.log('setup tealium <> ketch integration');
  console.log(window.tealiumCmpIntegration.cmpName);
})(window);
