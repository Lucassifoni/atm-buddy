<template>
  <div>
    <h3 class="subtitle" style="margin-bottom: 0">
      {{ $t("stig.title") }}
    </h3>
    <p>
      {{ $t("stig.instruction") }}
    </p>
    <table class="table" style="margin-bottom: 0.75em; margin: auto">
      <thead>
        <tr>
          <th>{{ $t("stig.axis") }}</th>
          <th>{{ $t("stig.elevation") }}</th>
          <th>{{ $t("stig.radius") }}</th>
          <th>{{ $t("stig.fix") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span class="tag is-danger">{{ $t("stig.red") }}</span>
          </td>
          <td>
            <strong>{{ $t("stig.high") }}</strong>
          </td>
          <td>
            <strong>{{ $t("stig.short") }}</strong>
          </td>
          <td>
            <strong>{{ $t("stig.tot") }}</strong>
          </td>
        </tr>
        <tr>
          <td>
            <span class="tag is-info">{{ $t("stig.blue") }}</span>
          </td>
          <td>
            <strong>{{ $t("stig.low") }}</strong>
          </td>
          <td>
            <strong>{{ $t("stig.long") }}</strong>
          </td>
          <td>
            <strong>{{ $t("stig.mot") }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
    <img src="/stiggy.png" />
  </div>
</template>
