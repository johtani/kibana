import { get } from 'lodash';
import { AggTypesMetricsMetricAggTypeProvider } from 'ui/agg_types/metrics/metric_agg_type';
import { makeNestedLabel } from './lib/make_nested_label';
import { SiblingPipelineAggHelperProvider } from './lib/sibling_pipeline_agg_helper';

export function AggTypesMetricsBucketAvgProvider(Private) {
  const MetricAggType = Private(AggTypesMetricsMetricAggTypeProvider);
  const siblingPipelineHelper = Private(SiblingPipelineAggHelperProvider);

  return new MetricAggType({
    name: 'avg_bucket',
    title: 'Average Bucket',
    makeLabel: agg => makeNestedLabel(agg, 'overall average'),
    subtype: siblingPipelineHelper.subtype,
    params: [
      ...siblingPipelineHelper.params()
    ],
    getFormat: siblingPipelineHelper.getFormat,
    getValue: function (agg, bucket) {
      const customMetric = agg.params.customMetric;
      const scaleMetrics = customMetric.type && customMetric.type.isScalable();

      let value = bucket[agg.id] && bucket[agg.id].value;
      if (scaleMetrics) {
        const aggInfo = agg.params.customBucket.write();
        value *= get(aggInfo, 'bucketInterval.scale', 1);
      }
      return value;
    }
  });
}
