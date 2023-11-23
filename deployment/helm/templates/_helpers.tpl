{{/*
Define args for frontend build
*/}}
{{- define "frontendBuild.args" -}}
  {{- if .Values.global.enableIngress }}
    {{- if eq .Values.global.mode "dev" }}
      - "build"
      - "--source-map"
      - "--serverUri"
      - "{{ .Values.frontendBuild.serverUri.base }}:{{ .Values.frontendBuild.serverUri.port.enableIngress }}"
    {{- else }}
      - "build"
      - "--serverUri"
      - "{{ .Values.frontendBuild.serverUri.base }}:{{ .Values.frontendBuild.serverUri.port.enableIngress }}"
    {{- end }}
  {{- else }}
    {{- if eq .Values.global.mode "dev" }}
      - "build"
      - "--source-map"
      - "--serverUri"
      - "{{ .Values.frontendBuild.serverUri.base }}:{{ .Values.frontendBuild.serverUri.port.disableIngress }}"
    {{- else }}
      - "build"
      - "--serverUri"
      - "{{ .Values.frontendBuild.serverUri.base }}:{{ .Values.frontendBuild.serverUri.port.disableIngress }}"
    {{- end }}
  {{- end }}
{{- end -}}
