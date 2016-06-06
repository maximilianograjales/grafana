///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import $ from 'jquery';
import angular from 'angular';

export class AlertTabCtrl {
  panel: any;
  panelCtrl: any;
  alerting: any;
  metricTargets = [{ refId: '- select query -' } ];
  operators = ['>', '<', '<=', '>='];
  aggregators = ['avg', 'sum', 'min', 'max', 'median'];

  defaultValues = {
    aggregator: 'avg',
    frequency: 10,
    queryRange: 3600,
    warnOperator: '>',
    critOperator: '>',
    queryRef: '- select query -'
  };

  /** @ngInject */
  constructor($scope, private $timeout) {
    $scope.alertTab = this; //HACK ATTACK!
    this.panelCtrl = $scope.ctrl;
    this.panel = this.panelCtrl.panel;

    _.defaults(this.panel.alerting, this.defaultValues);

    var defaultName = (this.panelCtrl.dashboard.title + ' ' + this.panel.title + ' alert');
    this.panel.alerting.name = this.panel.alerting.name || defaultName;

    this.panel.targets.map(target => {
      this.metricTargets.push(target);
    });
    this.panel.alerting.queryRef = this.panel.alerting.queryRef || this.metricTargets[0].refId;

    this.convertThresholdsToAlertThresholds();
  }

  convertThresholdsToAlertThresholds() {
    if (this.panel.grid
        && this.panel.grid.threshold1
        && this.panel.alerting.warnLevel === undefined
       ) {
      this.panel.alerting.warnOperator = '>';
      this.panel.alerting.warnLevel = this.panel.grid.threshold1;
    }

    if (this.panel.grid
        && this.panel.grid.threshold2
        && this.panel.alerting.critLevel === undefined
       ) {
      this.panel.alerting.critOperator = '>';
      this.panel.alerting.critLevel = this.panel.grid.threshold2;
    }
  }

  markAsDeleted() {
    if (this.panel.alerting) {
      this.panel.alerting = this.defaultValues;
    }
  }

  thresholdsUpdated() {
    if (this.panel.alerting.warnLevel) {
      this.panel.grid.threshold1 = parseInt(this.panel.alerting.warnLevel);
    }

    if (this.panel.alerting.critLevel) {
      this.panel.grid.threshold2 = parseInt(this.panel.alerting.critLevel);
    }

    this.panelCtrl.render();
  }
}

/** @ngInject */
export function graphAlertEditor() {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'public/app/plugins/panel/graph/partials/tab_alerting.html',
    controller: AlertTabCtrl,
  };
}
