import { Component } from '@angular/core';
import * as json5 from 'json5';

@Component({
  selector: 'app-json-formatter',
  templateUrl: './json-formatter.component.html',
  styleUrls: ['./json-formatter.component.scss']
})
export class JsonFormatterComponent {
  rawJson = '';
  formattedJson: string | null = null;

  formatJson() {
    try {
      this.formattedJson = JSON.stringify(json5.parse(this.rawJson), null, 2);
    } catch (error) {
      this.showFixConfirmation();
    }
  }

  showFixConfirmation() {
    const userResponse = confirm('Your JSON is not valid. Do you want to attempt to fix it?');
    if (userResponse) {
      try {
        // Attempt to fix the JSON using json5
        this.rawJson = this.fixJson(this.rawJson);
        this.formattedJson = JSON.stringify(json5.parse(this.rawJson), null, 2);
      } catch (error) {
        console.error('Error fixing JSON:', error);
        alert('Unable to fix the JSON. Please correct it manually.');
      }
    }
  }

  fixJson(jsonText: string): string {
    jsonText = jsonText.replace(/,\s*([\]}])/g, '$1');
    return jsonText;
  }

  download() {
    const jsonString = JSON.stringify(this.rawJson, null, 2); // 2 spaces for indentation
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
