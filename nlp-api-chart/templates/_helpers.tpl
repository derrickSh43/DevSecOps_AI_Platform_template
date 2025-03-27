{{/*
Generate the name for the chart.
*/}}
{{- define "nlp-api-chart.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{/*
Generate the fullname for the chart.
*/}}
{{- define "nlp-api-chart.fullname" -}}
{{- .Release.Name }}-{{ .Chart.Name }}
{{- end -}}

{{/*
Generate the common labels for the chart.
*/}}
{{- define "nlp-api-chart.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.Version }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Generate the selector labels for the chart.
*/}}
{{- define "nlp-api-chart.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
