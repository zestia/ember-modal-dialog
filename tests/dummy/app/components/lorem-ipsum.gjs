import Component from '@glimmer/component';

export default class LoremIpsumComponent extends Component {
  get amount() {
    return [...Array(this.args.amount).keys()];
  }

  <template>
    {{#each this.amount}}
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut est
        eget nulla malesuada pretium id eu ipsum. Nam eu turpis et quam rutrum
        molestie a vitae tortor. Maecenas nec ex est. Nulla quis leo id leo
        commodo sagittis. Nullam diam dolor, semper sed convallis ut, facilisis
        sollicitudin quam. Ut a fermentum turpis, ac gravida elit. Fusce sed leo
        mollis nibh tincidunt ornare. Quisque convallis sodales erat, eget
        ultricies nulla pellentesque ut. Curabitur nec sem lorem.
      </p>
    {{/each}}
  </template>
}
