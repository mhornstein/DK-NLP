{{/*
Define args for frontend build
*/}}
{{- define "frontendBuild.args" -}}
  {{- if eq .Values.global.mode "dev" }}
    - "build"
    - "--source-map"
    - "--serverUri"
    - "{{ .Values.frontendBuild.serverUri.base }}:{{ .Values.frontendBuild.serverUri.port }}"
  {{- else }}
    - "build"
    - "--serverUri"
    - "{{ .Values.frontendBuild.serverUri.base }}:{{ .Values.frontendBuild.serverUri.port }}"
  {{- end }}
{{- end -}}
